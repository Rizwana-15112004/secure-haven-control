package com.securehaven.control.controller;

import com.securehaven.control.model.Donor;
import com.securehaven.control.repository.DonorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
@CrossOrigin(origins = "*")
public class DonorController {

    private final DonorRepository donorRepository;
    private final BroadcastingService broadcastingService;

    public DonorController(DonorRepository donorRepository, BroadcastingService broadcastingService) {
        this.donorRepository = donorRepository;
        this.broadcastingService = broadcastingService;
    }

    @GetMapping
    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    @PostMapping
    public Donor createDonor(@RequestBody Donor donor) {
        Donor savedDonor = donorRepository.save(donor);
        broadcastingService.broadcast("donor_updated", savedDonor);
        return savedDonor;
    }

    @PutMapping("/{id}")
    public Donor updateDonor(@PathVariable Long id, @RequestBody Donor donorDetails) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found with id: " + id));

        donor.setName(donorDetails.getName());
        donor.setBloodType(donorDetails.getBloodType());
        donor.setLastDonationDate(donorDetails.getLastDonationDate());
        donor.setContactNumber(donorDetails.getContactNumber());
        donor.setLocation(donorDetails.getLocation());
        donor.setEligible(donorDetails.isEligible());

        Donor updatedDonor = donorRepository.save(donor);
        broadcastingService.broadcast("donor_updated", updatedDonor);
        return updatedDonor;
    }

    @DeleteMapping("/{id}")
    public void deleteDonor(@PathVariable Long id) {
        donorRepository.deleteById(id);
        broadcastingService.broadcast("donor_updated", Map.of("id", id, "deleted", true));
    }
}
